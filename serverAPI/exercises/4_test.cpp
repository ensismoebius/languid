#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(MaiorDeDoisNumerosTest, OutputTest)
{
    system("echo '8 12' | /tmp/code_exec > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Maior: 12");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

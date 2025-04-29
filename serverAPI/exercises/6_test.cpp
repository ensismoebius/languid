#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(SomaVetorTest, OutputTest)
{
    system("echo '1 2 3 4 5' | ./code_exec > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Soma: 15");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

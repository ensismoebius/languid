#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(MultiplicacaoSimplesTest, OutputTest)
{
    system("echo '5 6' | /tmp/code_exec > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Produto: 30");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
